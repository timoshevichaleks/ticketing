import { PaymentCreatedEvent, Publisher, Subjects } from "@altick/common";
import { Stan } from "node-nats-streaming";

export class PaymentsCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  public readonly subject: Subjects.PaymentsCreated = Subjects.PaymentsCreated;

  public constructor(client: Stan) {
    super(client);
  }
}
