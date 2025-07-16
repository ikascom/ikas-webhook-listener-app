import React from 'react';
import styled from 'styled-components';

const LoadingWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100svh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 500;
`;

function Loading() {

  return (
    <LoadingWrapper>
      <div>Lütfen Bekleyin...</div>
    </LoadingWrapper>
  );
}

export default Loading;
