import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent, TicketUpdatedEvent } from "@altick/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedListeners } from "../ticket-updated-listeners";
import { Ticket } from "../../../model/ticket";

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListeners(natsWrapper.client);

  // create and save ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 1000,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { listener, data, msg, ticket, };
};

it('should finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket, } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price );
  expect(updatedTicket!.version).toEqual(data.version );
});

it('should ack the message', async () => {
  const { listener, data, msg, ticket, } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('should does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg, ticket, } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
