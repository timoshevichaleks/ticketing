import { Listener, Subjects, TicketCreatedEvent } from "@altick/common";
import { Message, Stan } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../model/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  public readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;

  public readonly queueGroupName: string = queueGroupName;

  public constructor(client: Stan) {
    super(client);
  }

  public async onMessage(data: TicketCreatedEvent["data"], msg: Message): Promise<void> {
    const { title, price, id } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    msg.ack();
  }
}
