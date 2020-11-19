import Book from '../models/Book';

export default {
  render(book: Book) {
    return {
      id: book.id,
      title: book.title,
      pages: book.pages,
      created_at: book.created_at
    };
  },

  renderMany(books: Book[]) {
    return books.map(book => this.render(book));
  }
}