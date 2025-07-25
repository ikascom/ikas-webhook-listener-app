'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
  background: #fff;
  min-height: 100vh;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  color: #28a745;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  color: #1a1a1a;
  font-size: 32px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0 0 32px 0;
  color: #666;
  font-size: 18px;
  line-height: 1.6;
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin: 32px 0;
  text-align: left;
`;

const InfoTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 600;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #495057;
`;

const InfoValue = styled.span`
  color: #6c757d;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 32px;
`;

const PrimaryButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }
`;

const SecondaryButton = styled.button`
  background: #6c757d;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.2);

  &:hover {
    background: #545b62;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 24px 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: #e7f3ff;
  border-radius: 8px;
  border-left: 4px solid #007bff;
`;

const FeatureIcon = styled.span`
  color: #007bff;
  font-size: 18px;
`;

const FeatureText = styled.span`
  color: #495057;
  font-size: 16px;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
  color: #666;
`;

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [storefrontId, setStorefrontId] = useState<string | null>(null);

  useEffect(() => {
    const scriptIdParam = searchParams.get('scriptId');
    const storefrontIdParam = searchParams.get('storefrontId');
    
    setScriptId(scriptIdParam);
    setStorefrontId(storefrontIdParam);
    
    // If no parameters, redirect to dashboard
    if (!scriptIdParam || !storefrontIdParam) {
      router.push('/dashboard');
    }
  }, [searchParams, router]);

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleGenerateAnother = () => {
    router.push('/dashboard');
  };

  return (
    <Container>
      <Card>
        <SuccessIcon>✅</SuccessIcon>
        
        <Title>Script Generated Successfully!</Title>
        <Subtitle>
          Your custom script has been created and injected into your storefront.
        </Subtitle>

        {scriptId && storefrontId && (
          <InfoSection>
            <InfoTitle>Script Details</InfoTitle>
            <InfoItem>
              <InfoLabel>Script ID:</InfoLabel>
              <InfoValue>{scriptId}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Storefront ID:</InfoLabel>
              <InfoValue>{storefrontId}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Created:</InfoLabel>
              <InfoValue>{new Date().toLocaleString()}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Status:</InfoLabel>
              <InfoValue>Active</InfoValue>
            </InfoItem>
          </InfoSection>
        )}

        <InfoSection>
          <InfoTitle>What&apos;s Next?</InfoTitle>
          <FeatureList>
            <FeatureItem>
              <FeatureIcon>🚀</FeatureIcon>
              <FeatureText>Your script is now live on your storefront</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>📝</FeatureIcon>
              <FeatureText>You can customize the script content from the dashboard</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureText>Monitor script performance and analytics</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>🔧</FeatureIcon>
              <FeatureText>Generate additional scripts for other storefronts</FeatureText>
            </FeatureItem>
          </FeatureList>
        </InfoSection>

        <ButtonGroup>
          <PrimaryButton onClick={handleGenerateAnother}>
            <span>⚡</span>
            Generate Another Script
          </PrimaryButton>
          <SecondaryButton onClick={handleBackToDashboard}>
            <span>🏠</span>
            Back to Dashboard
          </SecondaryButton>
        </ButtonGroup>
      </Card>
    </Container>
  );
}

export default function Success() {
  return (
    <Suspense fallback={<LoadingMessage>Loading...</LoadingMessage>}>
      <SuccessContent />
    </Suspense>
  );
} 