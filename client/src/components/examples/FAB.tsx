import { FAB } from '../FAB';

export default function FABExample() {
  return (
    <div className="bg-background h-96 relative">
      <FAB onClick={() => console.log('Add note clicked')} />
    </div>
  );
}
