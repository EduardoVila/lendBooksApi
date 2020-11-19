import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import User from './User';

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
}