const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const { signout, signup, signin, isSignedIn } = require('../controllers/auth');

router.post(
  '/signup',
  [
    check('name', 'enter a valid name').isLength({ min: 3 }),
    check('email').isEmail().withMessage('please provide a valid mail id'),

    check('password')
      .isLength({ min: 5, max: 10 })
      .withMessage('password must contain characters between 5 to 10'),
  ],
  signup
);
router.get('/signout', signout);

router.post(
  '/signin',
  [
    check('password')
      .isLength({ min: 5, max: 10 })
      .withMessage('password must contain characters between 5 to 10'),
    check('email').isEmail().withMessage('please provide a valid mail id'),
  ],
  signin
);

router.get('/signout', signout);

module.exports = router;
