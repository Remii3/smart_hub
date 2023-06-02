const Author = require('../Models/author');

const getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (error) {
        res.status(500).json({
            error: 'Failed fetching authors',
        });
    }
};

const addAuthor = async (req, res) => {
    try {
        const { name } = req.body;
        const author = new Author({ name });
        await author.save();
        res.status(201).json(author);
    } catch (err) {
        res.status(500).json({ error: 'Failed adding new author' });
    }
};

module.exports = { getAuthors, addAuthor };
