import { Entity, PrimaryColumn, CreateDateColumn, Column } from "typeorm";

export type VALID_REASON_EXT = 'productivity' | 'elasticity' | 'recover' | 'profilactics' | 'tension' | 'other';

@Entity()
export class User {

    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable: true})
    name: string | null;

    @Column({nullable: true})
    username: string | null;

    @Column({default: 'none'})
    waitingFor: 'name' | 'phone' | 'age' | 'address' | 'tellMore' | 'none';

    @Column({default: false})
    complete: boolean;

    @Column({nullable: true})
    age: number;

    @Column({nullable: true})
    sex: 'male' | 'female';

    @Column({nullable: true})
    sport: 'd' | 'w' | 'r';

    @Column({nullable: true})
    muscleGroup: number;

    @Column({nullable: true})
    painScale: number;

    @Column({nullable: true})
    sportIssue: 'p' | 't' | 'e' | 's';

    @Column({nullable: true})
    skinIssue: 'detox' | 'swelling' | 'fading-skin' | 'improve-skin'|'other';

    @Column({nullable: true})
    skinState: number;

    @Column({nullable: true})
    skinState2: string;

    @Column({nullable: true})
    stress: string;

    @Column({nullable: true})
    mental: number;

    @Column({nullable: true})
    hasPain: string;

    @Column({nullable: true})
    stressIssue: string;

    @Column({nullable: true})
    lastQuery: string;
    
    @Column({nullable: true, type: 'text'})
    tellMore: string;

    @Column({nullable: true})
    tellMoreQuery: string;

    @Column({nullable: true})
    healthIssue: string;

    @Column({nullable: true})
    lymphAge: string;

    @Column({nullable: true})
    work: string;

    @Column({nullable: true})
    workType: string;
}