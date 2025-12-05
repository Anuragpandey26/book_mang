import { User, BorrowTransaction } from '../models/index.js';
import { hashPassword } from '../utils/password.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, address, role, password } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    
    if (!password && !role) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    
    const finalPassword = password || `temp${Date.now()}`;
    const hashedPassword = await hashPassword(finalPassword);

    const user = await User.create({
      name,
      email,
      phone,
      address,
      role: role || 'member',
      password: hashedPassword
    });

    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, email, phone, address, password } = req.body;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const updateData = {
      name: name || user.name,
      email: email || user.email,
      phone: phone !== undefined ? phone : user.phone,
      address: address !== undefined ? address : user.address
    };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    await user.update(updateData);

    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const activeBorrows = await BorrowTransaction.count({
      where: {
        user_id: req.params.id,
        status: 'borrowed'
      }
    });

    if (activeBorrows > 0) {
      return res.status(400).json({ error: 'Cannot delete user with pending books' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
