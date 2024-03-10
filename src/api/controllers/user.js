const User = require('../../api/models/user');

const registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);

    const userDuplicated = await User.findOne({ email: req.body.email });
    if (userDuplicated) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newUser.password)) {
      return res.status(400).json({
        error:
          'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit',
      });
    }

    const user = await newUser.save();

    res.status(201).json({ data: user });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

module.exports = {
  registerUser,
};
