import LendBook from '../models/LendBook';

export default {
  render(lendBook: LendBook) {
    return {
      book_id: lendBook.book.id,
      from_user: lendBook.from_user.id,
      to_user: lendBook.to_user.id,
      lent_at: lendBook.lent_at,
      returned_at: lendBook.returned_at || ''
    };
  },

  renderMany(lendBooks: LendBook[]) {
    return lendBooks.map(lendBook => this.render(lendBook));
  }
}