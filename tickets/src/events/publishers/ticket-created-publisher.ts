import { Publisher, Subjects, TicketCreatedEvent } from "@altick/common";
import { Stan } from "node-nats-streaming";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  public readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;

  public constructor(stan: Stan) {
    super(stan);
  }
}
