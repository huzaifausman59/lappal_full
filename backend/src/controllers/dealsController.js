import { createDealModel } from "../models/dealsModel.js";

export const createDeal = (req, res) => {
  const buyerId = req.user.id;
  const { conversation_id, listing_id, seller_id } = req.body;

  if (!conversation_id || !listing_id || !seller_id) {
    return res.status(400).json({
      message: "conversation_id, listing_id, seller_id required",
    });
  }

  createDealModel(
    conversation_id,
    buyerId,
    seller_id,
    listing_id,
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Deal marked as complete",
        dealId: result.insertId,
      });
    }
  );
};