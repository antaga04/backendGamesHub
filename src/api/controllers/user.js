const User = require('../../api/models/user');
const { verifyPassword, hashPassword } = require('../../utils/password');
const { signToken } = require('../../utils/jwt');
const { deleteCloudinaryImage } = require('../../utils/cloudinary');
const { validateNickname, validateEmail } = require('../../utils/validation');

const registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);

    const userDuplicated = await User.findOne({ email: req.body.email });
    if (userDuplicated) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const nicknameValidation = validateNickname(newUser.nickname);
    if (!nicknameValidation.valid) {
      return res.status(400).json({ error: nicknameValidation.message });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newUser.password)) {
      return res.status(400).json({
        error:
          'Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase, and one digit',
      });
    }

    const user = await newUser.save();

    res.status(201).json({ data: user });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Error registering user' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).lean();

    if (!user) {
      res.status(401).json({ data: `User doesn't exist` });
      return;
    }

    const validPassword = await verifyPassword(password, user.password);

    if (!validPassword) {
      res.status(401).json({ data: `Incorrect email or password` });
      return;
    }

    const token = signToken({ id: user._id });
    const { password: unusedPassword, ...restUser } = user;
    res.status(200).json({ data: { token, user: restUser } });
  } catch (err) {
    res.status(400).json({ error: 'Error login' });
  }
};

const updateUserAvatar = async (req, res) => {
  const { path } = req.file; // The new avatar URL from Cloudinary
  const { id } = req.user; // Assuming the user ID is coming from the auth middleware

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has an existing avatar
    if (user.avatar) {
      // Delete the old avatar from Cloudinary
      await deleteCloudinaryImage(user.avatar);
    }

    // Update the user's avatar with the new one
    user.avatar = path;
    await user.save();

    res.status(201).json({ data: path });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const updates = req.body;

    const oldUser = await User.findById(id);
    if (!oldUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate nickname
    const nicknameValidation = validateNickname(updates.nickname);
    if (!nicknameValidation.valid) {
      return res.status(400).json({ error: nicknameValidation.message });
    }

    // Validate email
    const emailValidation = validateEmail(updates.email);
    if (!emailValidation.valid) {
      return res.status(400).json({ error: emailValidation.message });
    }

    // Only hash the password if it's being updated
    console.log(updates.password);
    
    if (updates.password !== undefined) {
      updates.password = await hashPassword(updates.password);
    }

    // Preserve old fields that should not be updated
    updates.rol = oldUser.rol; // Keep the old role
    updates.scores = oldUser.scores; // Keep the scores

    // Update the user with the new data
    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'An unexpected error occurred while updating the user.' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: 'Error fetching user details' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  updateUserAvatar,
  getUser,
};
