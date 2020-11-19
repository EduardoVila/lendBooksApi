import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, JoinColumn } from 'typeorm'
import Book from './Book';
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
 
  @JoinColumn({ name: 'professional_id' })
  books: Book[];
}