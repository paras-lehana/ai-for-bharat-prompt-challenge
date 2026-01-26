const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { Dispute, Evidence } = require('../models');

router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { transactionId, reason, description } = req.body;

  const dispute = await Dispute.create({
    transactionId,
    initiatorId: req.user.id,
    respondentId: req.body.respondentId,
    status: 'pending',
    reason,
    description
  });

  res.status(201).json(dispute);
}));

router.post('/:id/evidence', authenticateToken, asyncHandler(async (req, res) => {
  const { evidenceType, content } = req.body;

  const evidence = await Evidence.create({
    disputeId: req.params.id,
    userId: req.user.id,
    evidenceType,
    content
  });

  res.status(201).json(evidence);
}));

router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const dispute = await Dispute.findByPk(req.params.id);
  const evidence = await Evidence.findAll({ where: { disputeId: req.params.id } });

  res.json({ dispute, evidence });
}));

module.exports = router;
