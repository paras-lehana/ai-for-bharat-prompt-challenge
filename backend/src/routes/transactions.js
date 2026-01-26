const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { Transaction } = require('../models');

router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByPk(req.params.id);
  res.json(transaction);
}));

router.put('/:id/confirm', authenticateToken, asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByPk(req.params.id);
  await transaction.update({ status: 'confirmed', confirmedAt: new Date() });
  res.json(transaction);
}));

router.put('/:id/ship', authenticateToken, asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByPk(req.params.id);
  await transaction.update({ status: 'in_transit', shippedAt: new Date() });
  res.json(transaction);
}));

router.put('/:id/deliver', authenticateToken, asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByPk(req.params.id);
  await transaction.update({ status: 'delivered', deliveredAt: new Date() });
  res.json(transaction);
}));

router.get('/buyer/:buyerId', authenticateToken, asyncHandler(async (req, res) => {
  const transactions = await Transaction.findAll({ where: { buyerId: req.params.buyerId } });
  res.json({ transactions });
}));

router.get('/vendor/:vendorId', authenticateToken, asyncHandler(async (req, res) => {
  const transactions = await Transaction.findAll({ where: { vendorId: req.params.vendorId } });
  res.json({ transactions });
}));

module.exports = router;
