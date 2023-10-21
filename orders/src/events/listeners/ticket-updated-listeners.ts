import { Listener, Subjects, TicketUpdatedEvent } from "@altick/common";
import { Message, Stan } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket, TicketDoc } from "../../model/ticket";

export class TicketUpdatedListeners extends Listener<TicketUpdatedEvent> {
  public readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  public readonly queueGroupName: string = queueGroupName;

  public constructor(client: Stan) {
    super(client);
  }

  public async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
    const { id, title, price, version } = data;
    const ticket: TicketDoc | null = await Ticket.findByEvent({ id, version, });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price, version, });
    await ticket.save();

    msg.ack();
  }
}
