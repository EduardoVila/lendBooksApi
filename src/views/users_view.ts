import User from '../models/User';
import books_view from './books_view';

export default {
  render(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      collection: user.books ? books_view.renderMany(user.books) : []
    };
  }
}