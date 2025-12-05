import { Author, Book } from '../models/index.js';

export const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll({
      include: [{
        model: Book,
        as: 'books',
        attributes: ['id', 'title']
      }]
    });
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id, {
      include: [{
        model: Book,
        as: 'books'
      }]
    });

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Author name is required' });
    }

    const author = await Author.create({ name, bio });
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const { name, bio } = req.body;
    await author.update({
      name: name || author.name,
      bio: bio !== undefined ? bio : author.bio
    });

    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const bookCount = await Book.count({ where: { author_id: req.params.id } });

    if (bookCount > 0) {
      return res.status(400).json({ error: 'Cannot delete author with linked books' });
    }

    await author.destroy();
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
