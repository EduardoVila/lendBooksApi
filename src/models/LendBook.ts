import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import User from './User';
import Book from './Book';

@Entity('lend_books')
export default class LendBook {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  lent_at: Date;

  @Column()
  returned_at: Date;

  @ManyToOne(() => User, user => user.lent_books)
  @JoinColumn({ name: 'from_user' })
  from_user: User;

  @ManyToOne(() => User, user => user.borrowed_books)
  @JoinColumn({ name: 'to_user' })
  to_user: User;

  @ManyToOne(() => Book, book => book.lend_books)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}