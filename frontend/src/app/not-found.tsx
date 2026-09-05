import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className='not-found'>
      <p className='not-found-kicker'>Unmapped path</p>
      <h1 className='not-found-title'>
        You wandered outside the mapped area.
      </h1>
      <p className='not-found-copy'>
        This route is not on the current map. Return to a
        known room, or continue through the library and
        workshop.
      </p>
      <div className='not-found-actions'>
        <Button href='/'>Return Home</Button>
        <Button href='/articles' variant='ghost'>
          Browse Articles
        </Button>
        <Button href='/projects' variant='outline'>
          View Projects
        </Button>
      </div>
    </section>
  );
}
