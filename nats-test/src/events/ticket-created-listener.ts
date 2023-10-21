import { Listener } from "../../../common/src/events/base-listener";
import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "../../../common/src/events/subjects";
import { TicketCreatedEvent } from "../../../common/src/events/ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  public readonly queueGroupName: string = 'payments-service';
  public readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;

  public constructor(stan: Stan) {
    super(stan);
  }

  public onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data!', data);

    msg.ack();
  }
}
