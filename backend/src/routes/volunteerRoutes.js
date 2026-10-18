const { Router } = require('express');
const volunteerController = require('../controllers/volunteerController');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', authenticateToken, volunteerController.list);
router.get('/:id', authenticateToken, volunteerController.getById);
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  volunteerController.create,
);
router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  volunteerController.update,
);
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  volunteerController.remove,
);

module.exports = router;
