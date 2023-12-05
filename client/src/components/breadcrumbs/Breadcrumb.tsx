import { buttonVariants } from '@components/UI/button';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Breadcrumb({
  pathStops,
}: {
  pathStops: { name: string; path?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link to="/" className={`text-primary`}>
            <span className="sr-only"> Home </span>

            <HomeIcon className="h-5 w-5" />
          </Link>
        </li>

        {pathStops.map((pathData, iteration) => (
          <li key={pathData.name} className="flex items-center gap-1">
            <span className="rtl:rotate-180 pt-[1px]">
              <ChevronRightIcon className="w-4 h-4" />
            </span>
            <div>
              {iteration === pathStops.length - 1 ? (
                <span className="inline-block pt-[3px]">{pathData.name}</span>
              ) : (
                <Link
                  to={pathData.path || '/'}
                  className={`${buttonVariants({
                    variant: 'link',
                    size: 'clear',
                  })} pt-1 font-normal`}
                >
                  {pathData.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
