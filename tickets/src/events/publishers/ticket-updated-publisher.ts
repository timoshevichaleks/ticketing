import { Publisher, Subjects, TicketUpdatedEvent } from "@altick/common";
import { Stan } from "node-nats-streaming";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  public readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  public constructor(stan: Stan) {
    super(stan);
  }
}
