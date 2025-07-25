'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { TokenHelpers } from '../../helpers/token-helpers';
import { ApiRequests } from '../../lib/api-requests';
import { StorefrontJSScriptContentTypeEnum } from '../../lib/ikas-client/generated/graphql';

interface Storefront {
  id: string;
  name: string;
  domain?: string;
  isDefault?: boolean;
}

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
  background: #fff;
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  color: #1a1a1a;
  font-size: 36px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #666;
  font-size: 18px;
  line-height: 1.6;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
`;

const StoreInfo = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  border: 2px solid #e9ecef;
`;

const StoreLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const StoreName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 8px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  color: #1a1a1a;
  font-size: 20px;
  font-weight: 600;
`;

const SectionDescription = styled.p`
  margin: 0 0 24px 0;
  color: #666;
  font-size: 16px;
  line-height: 1.6;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 32px;
`;

const GenerateButton = styled.button`
  background: #28a745;
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
  min-width: 200px;
  justify-content: center;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-direction: column;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 40px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 20px;
`;

const EmptyText = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 16px;
`;

/**
 * DashboardPage
 * - Main dashboard component with storefront selection and script generation
 */
export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('');
  const [storefronts, setStorefronts] = useState<Storefront[]>([]);
  const [selectedStorefront, setSelectedStorefront] = useState<string>('');
  const [loadingStorefronts, setLoadingStorefronts] = useState(false);
  const [generatingScript, setGeneratingScript] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches and sets the store name using the provided token.
   */
  const fetchStoreName = useCallback(async (currentToken: string) => {
    try {
      const res = await ApiRequests.ikas.getMerchant(currentToken);
      if (res.status === 200 && res.data?.data?.merchantInfo?.storeName) {
        setStoreName(res.data.data.merchantInfo.storeName);
      }
    } catch (error) {
      console.error('Error fetching store name:', error);
    }
  }, []);

  /**
   * Loads storefronts from the API
   */
  const loadStorefronts = useCallback(async (currentToken: string) => {
    setLoadingStorefronts(true);
    setError(null);
    
    try {
      const response = await ApiRequests.ikas.listStorefront(currentToken);
      if (response.data?.data?.storefronts) {
        setStorefronts(response.data.data.storefronts);
        // Auto-select first storefront if available
        if (response.data.data.storefronts.length > 0) {
          setSelectedStorefront(response.data.data.storefronts[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load storefronts:', error);
      setError('Failed to load storefronts. Please try again.');
    } finally {
      setLoadingStorefronts(false);
    }
  }, []);

  /**
   * Initializes the dashboard by fetching the token, store name, and storefronts.
   */
  const initializeDashboard = useCallback(async () => {
    try {
      const fetchedToken = await TokenHelpers.getTokenForIframeApp(router);
      setToken(fetchedToken || null);

      if (fetchedToken) {
        await fetchStoreName(fetchedToken);
        await loadStorefronts(fetchedToken);
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      setError('Failed to initialize dashboard');
    }
  }, [router, fetchStoreName, loadStorefronts]);

  // Run initialization on mount
  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  /**
   * Handles script generation
   */
  const handleGenerateScript = async () => {
    if (!selectedStorefront || !token) {
      setError('Please select a storefront');
      return;
    }

    setGeneratingScript(true);
    setError(null);

    try {
      const response = await ApiRequests.ikas.createStorefrontJsScript(
        { 
          scriptInput: { 
            storefrontId: selectedStorefront,
            name: 'Custom Script',
            scriptContent: '<script>console.log("Custom script loaded");</script>',
            contentType: StorefrontJSScriptContentTypeEnum.SCRIPT
          }
        },
        token
      );

      if (response.data?.data?.storefrontJSScript) {
        // Redirect to success page with script info
        const scriptId = response.data.data.storefrontJSScript.id;
        router.push(`/success?scriptId=${scriptId}&storefrontId=${selectedStorefront}`);
      } else {
        setError('Failed to generate script. Please try again.');
      }
    } catch (error) {
      console.error('Error generating script:', error);
      setError('Failed to generate script. Please try again.');
    } finally {
      setGeneratingScript(false);
    }
  };

  if (!token) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Script Injector</Title>
        <Subtitle>
          Generate and inject custom scripts into your storefront
        </Subtitle>
      </Header>

      <Card>
        {storeName && (
          <StoreInfo>
            <StoreLabel>Current Store</StoreLabel>
            <StoreName>{storeName}</StoreName>
          </StoreInfo>
        )}

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <Section>
          <SectionTitle>Select Storefront</SectionTitle>
          <SectionDescription>
            Choose the storefront where you want to inject your custom script.
          </SectionDescription>
          
          <FormGroup>
            <Label htmlFor="storefront">Storefront</Label>
            <Select
              id="storefront"
              value={selectedStorefront}
              onChange={(e) => setSelectedStorefront(e.target.value)}
              disabled={loadingStorefronts || storefronts.length === 0}
            >
              {loadingStorefronts ? (
                <option>Loading storefronts...</option>
              ) : storefronts.length === 0 ? (
                <option>No storefronts available</option>
              ) : (
                <>
                  <option value="">Select a storefront</option>
                  {storefronts.map((storefront) => (
                    <option key={storefront.id} value={storefront.id}>
                      {storefront.name} {storefront.domain && `(${storefront.domain})`}
                      {storefront.isDefault ? ' - Default' : ''}
                    </option>
                  ))}
                </>
              )}
            </Select>
          </FormGroup>

          <ButtonGroup>
            <GenerateButton
              onClick={handleGenerateScript}
              disabled={!selectedStorefront || generatingScript || loadingStorefronts}
            >
              {generatingScript && <LoadingSpinner style={{ width: '20px', height: '20px' }} />}
              <span>⚡</span>
              {generatingScript ? 'Generating...' : 'Generate Script'}
            </GenerateButton>
          </ButtonGroup>
        </Section>
      </Card>
    </Container>
  );
}
