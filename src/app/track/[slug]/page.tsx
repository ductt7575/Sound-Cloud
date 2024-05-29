'use client';
import WaveTrack from '@/components/track/wave.track';
import { Container } from '@mui/material';
import { useSearchParams } from 'next/navigation';

const DetailTrackPage = (props: any) => {
  const searchParams = useSearchParams();

  const search = searchParams.get('audio');

  return (
    <Container>
      <div>
        Track Page details{' '}
        <div>
          <WaveTrack />
        </div>
      </div>
    </Container>
  );
};

export default DetailTrackPage;
