import type {Metadata} from 'next';import {SignupForm} from '@/components/AuthForms';
export const metadata:Metadata={title:'Sign Up',description:'Create your free CraftSprint account.'};
export default function SignupPage(){return <SignupForm/>}
