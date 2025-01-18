interface UserProps {
  name: string;
  age: number;
}
const User: React.FC<UserProps> = ({ name, age }) => (
  <p>
    {name}, {age}
  </p>
);
const getData = <T,>(data: T): T => data; // Example of generics
