import User from '../models/User';
import books_view from './books_view';
import lend_books_view from './lend_books_view';

export default {
  render(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      collection: user.books ? books_view.renderMany(user.books) : [],
      lent_books: user.lent_books ? lend_books_view.renderMany(user.lent_books) : [],
      borrowed_books: user.borrowed_books ? lend_books_view.renderMany(user.borrowed_books) : []
    };
  }
}