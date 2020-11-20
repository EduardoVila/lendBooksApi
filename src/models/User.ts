import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, JoinColumn } from 'typeorm'

import Book from './Book';
import LendBook from './LendBook';
@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Book, book => book.user, {
    cascade: ['insert', 'update']
  })
 
  @JoinColumn({ name: 'user_id' })
  books: Book[];

  @OneToMany(() => LendBook, lendBook => lendBook.from_user, {
    cascade: ['insert', 'update']
  })

  @JoinColumn({ name: 'from_user' })
  lent_books: LendBook[];

  @OneToMany(() => LendBook, lendBook => lendBook.to_user, {
    cascade: ['insert', 'update']
  })

  @JoinColumn({ name: 'to_user' })
  borrowed_books: LendBook[];
}