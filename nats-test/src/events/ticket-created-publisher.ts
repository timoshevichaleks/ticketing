import { Publisher } from "../../../common/src/events/base-publisher";
import { TicketCreatedEvent } from "../../../common/src/events/ticket-created-event";
import { Subjects } from "../../../common/src/events/subjects";
import { Stan } from "node-nats-streaming";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  public readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;

  public constructor(stan: Stan) {
    super(stan);
  }
}
