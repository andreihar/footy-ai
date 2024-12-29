'use client';

function Time({ date, locale, match }: { date: Date; locale: string; match: boolean; }) {
  return (
    <>
      {match ? (
        <>
          {new Date(date).toLocaleString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          &nbsp; • &nbsp;
          {new Date(date).toLocaleString(locale, { hour: 'numeric', minute: 'numeric' })}
        </>
      ) : (
        new Date(date).toLocaleString(locale, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
      )}
    </>
  );
}

export default Time;
