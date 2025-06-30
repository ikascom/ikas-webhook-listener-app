import React from 'react';
import styled from 'styled-components';

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

const SkeletonItem = styled.div`
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonTitle = styled(SkeletonItem)`
  height: 32px;
  width: 200px;
`;

const SkeletonText = styled(SkeletonItem)`
  height: 16px;
  width: 100%;
`;

const SkeletonButton = styled(SkeletonItem)`
  height: 40px;
  width: 120px;
`;

export default function SectionSkeleton() {
  return (
    <SkeletonContainer>
      <SkeletonTitle />
      <SkeletonText />
      <SkeletonText />
      <SkeletonText />
      <SkeletonButton />
    </SkeletonContainer>
  );
} 