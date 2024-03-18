import { Payment } from "@/utils/types/mongoose";
import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema<Payment>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: Schema.Types.String, required: true, trim: true },
  createdAt: { type: Schema.Types.Date, required: true, default: new Date() },
  paymentId: { type: Schema.Types.String, trim: true },
  currency: { type: Schema.Types.String, required: true, trim: true },
  amount: { type: Schema.Types.Number, required: true },
});

const PaymentModel =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default PaymentModel;
