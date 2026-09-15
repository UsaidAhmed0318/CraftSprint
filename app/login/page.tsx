import type {Metadata} from 'next';import {LoginForm} from '@/components/AuthForms';
export const metadata:Metadata={title:'Log In',description:'Log in to your CraftSprint account.'};
export default function LoginPage(){return <LoginForm/>}
