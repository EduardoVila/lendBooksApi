import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm'
import User from './User';
import LendBook from './LendBook';

@Entity('books')
export default class Book {
  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @Column()
  title: string;

  @Column()
  pages: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.books)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => LendBook, lendBook => lendBook.book, {
    cascade: ['insert', 'update']
  })
 
  @JoinColumn({ name: 'book_id' })
  lend_books: LendBook[];
}