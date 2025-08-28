import React, { useState, useEffect, useCallback } from 'react';
import { ApiRequests } from '@/lib/api-requests';
import { Webhook, WebhookInput, SalesChannel } from '@/lib/ikas-client/generated/graphql';
import { WebhookScope } from '@ikas/admin-api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Props for WebhookPage component
interface WebhookPageProps {
  token: string | null;
  storeName?: string;
}

// Utility UI bits
const Spinner = ({ size = 40 }: { size?: number }) => (
  <div
    className="animate-spin rounded-full border-4 border-muted border-t-primary"
    style={{ width: size, height: size }}
  />
);

// Available webhook scopes
const WEBHOOK_SCOPES = Object.values(WebhookScope);

/**
 * WebhookPage component for managing webhooks with table format
 */
const WebhookPage: React.FC<WebhookPageProps> = ({ token, storeName }) => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingSalesChannels, setIsLoadingSalesChannels] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'webhooks' | 'products'>('webhooks');
  const [products, setProducts] = useState<Array<{ id: string; name?: string }>>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState<WebhookInput>({
    endpoint: '',
    scopes: [],
    salesChannelIds: []
  });

  // Load webhooks and sales channels on mount and when token changes
  useEffect(() => {
    if (token) {
      loadWebhooks();
      loadSalesChannels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadProducts = useCallback(async () => {
    if (!token) return;
    setIsLoadingProducts(true);
    try {
      const response = await ApiRequests.ikas.listProduct(token);
      if (response.data?.data?.items) {
        setProducts(response.data.data.items);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && activeTab === 'products') {
      loadProducts();
    }
  }, [token, activeTab, loadProducts]);

  /**
   * Loads webhooks from the API
   */
  const loadWebhooks = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await ApiRequests.ikas.listWebhook(token);
      if (response.data?.data?.webhooks) {
        setWebhooks(response.data.data.webhooks.filter(w => !w.deleted));
      }
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Loads sales channels from the API
   */
  const loadSalesChannels = useCallback(async () => {
    if (!token) return;

    setIsLoadingSalesChannels(true);
    try {
      const response = await ApiRequests.ikas.listSalesChannel(token);
      if (response.data?.data?.salesChannels) {
        setSalesChannels(response.data.data.salesChannels);
      }
    } catch (error) {
      console.error('Failed to load sales channels:', error);
    } finally {
      setIsLoadingSalesChannels(false);
    }
  }, [token]);

  /**
   * Opens the modal for creating a new webhook
   */
  const handleAddWebhook = () => {
    setEditingWebhook(null);
    setFormData({
      endpoint: '',
      scopes: [],
      salesChannelIds: []
    });
    setIsModalOpen(true);
  };

  /**
   * Opens the modal for editing an existing webhook
   */
  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setFormData({
      endpoint: webhook.endpoint,
      scopes: [webhook.scope], // Convert single scope to array for editing
      salesChannelIds: [] // salesChannelIds field doesn't exist in Webhook interface
    });
    setIsModalOpen(true);
  };

  /**
   * Closes the modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWebhook(null);
    setFormData({
      endpoint: '',
      scopes: [],
      salesChannelIds: []
    });
  };

  /**
   * Handles form submission for saving webhooks
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formData.endpoint || formData.scopes.length === 0) return;

    setIsSaving(true);
    try {
      await ApiRequests.ikas.saveWebhook({ webhookInput: formData }, token);
      await loadWebhooks(); // Reload webhooks after saving
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save webhook:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handles webhook deletion
   */
  const handleDeleteWebhook = async (webhook: Webhook) => {
    if (!token) return;

    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete this webhook?\n\nEndpoint: ${webhook.endpoint}\nScope: ${webhook.scope}\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(webhook.id);
    try {
      await ApiRequests.ikas.deleteWebhook({ scopes: webhook.scope }, token);
      await loadWebhooks(); // Reload webhooks after deletion
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      alert('Failed to delete webhook. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  /**
   * Toggles scope selection
   */
  const toggleScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope]
    }));
  };

  /**
   * Toggles sales channel selection
   */
  const toggleSalesChannel = (salesChannelId: string) => {
    setFormData(prev => {
      const currentIds = prev.salesChannelIds || [];
      return {
        ...prev,
        salesChannelIds: currentIds.includes(salesChannelId)
          ? currentIds.filter(id => id !== salesChannelId)
          : [...currentIds, salesChannelId]
      };
    });
  };

  /**
   * Formats timestamp to readable date
   */
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Beautify webhook scope for display (remove "Store", title-case words)
  const beautifyScope = (rawScope: string) => {
    if (!rawScope) return '';
    const withSpaces = rawScope
      .replace(/[/_-]+/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    const withoutStore = withSpaces
      .replace(/\bstore\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    return withoutStore
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (!token) {
    return (
      <div className="max-w-[1200px] mx-auto p-6 bg-background min-h-[100vh]">
        <div className="text-center p-20 bg-muted rounded-xl border border-dashed">
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground">Please authenticate to manage webhooks.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[1200px] mx-auto p-6 bg-background min-h-[100vh]">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">ikas Sample App</h1>
              {storeName && <div className="text-sm text-muted-foreground">Store: {storeName}</div>}
            </div>
          </div>
          <div className="inline-flex h-10 items-center rounded-md border p-1 text-sm">
            <button
              className={`px-3 py-1.5 rounded ${activeTab === 'webhooks' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => setActiveTab('webhooks')}
            >
              Webhooks
            </button>
            <button
              className={`px-3 py-1.5 rounded ${activeTab === 'products' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
          </div>
        </div>

        {activeTab === 'webhooks' && (isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <Spinner />
            <div className="text-muted-foreground">Loading webhooks...</div>
          </div>
        ) : webhooks.length === 0 ? (
          <div className="text-center p-20 bg-muted rounded-xl border">
            <h3 className="text-lg font-semibold mb-2">No Webhooks Found</h3>
            <p className="text-muted-foreground">Click Add New Webhook to create your first webhook endpoint.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint URL</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell>
                    <div className="font-mono text-sm text-blue-700 break-all max-w-[300px] truncate">{webhook.endpoint}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                      {beautifyScope(webhook.scope)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground font-mono">{formatDate(webhook.createdAt)}</div>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWebhook(webhook)}
                      disabled={isDeleting === webhook.id}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteWebhook(webhook)}
                      disabled={isDeleting === webhook.id}
                    >
                      {isDeleting === webhook.id ? (
                        <span className="inline-flex items-center gap-2"><Spinner size={14} /> Deleting...</span>
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}

        {activeTab === 'webhooks' && (
          <div className="mt-6">
            <Button onClick={handleAddWebhook} disabled={isLoading} className="gap-2">
              <span>+</span>
              Add New Webhook
            </Button>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            {isLoadingProducts ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                <Spinner />
                <div className="text-muted-foreground">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center p-20 bg-muted rounded-xl border">
                <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground">Products will appear here after they are created.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-sm">{p.id}</TableCell>
                      <TableCell>{p.name || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWebhook ? 'Edit Webhook' : 'Add New Webhook'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="endpoint">Webhook Endpoint URL</Label>
              <Input
                id="endpoint"
                type="url"
                value={formData.endpoint}
                onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder="https://your-app.com/webhooks/ikas"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Select Webhook Scopes</Label>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-md border">
                {WEBHOOK_SCOPES.map((scope) => {
                  const checked = formData.scopes.includes(scope);
                  return (
                    <label key={scope} className="inline-flex items-center gap-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleScope(scope)}
                      />
                      <span className="text-sm">{beautifyScope(scope)}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Select Sales Channels (Optional)</Label>
              {isLoadingSalesChannels ? (
                <div className="p-5 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner size={20} /> Loading sales channels...
                  </div>
                </div>
              ) : salesChannels.length === 0 ? (
                <div className="p-5 text-center rounded-md border text-sm text-muted-foreground">
                  No sales channels found
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 p-4 rounded-md border max-h-[200px] overflow-y-auto">
                  {salesChannels.map((channel) => {
                    const selected = formData.salesChannelIds?.includes(channel.id) || false;
                    return (
                      <label key={channel.id} className="inline-flex items-center gap-2 min-w-[120px]">
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => toggleSalesChannel(channel.id)}
                        />
                        <span className="text-sm">{channel.name || `Channel ${channel.id}`}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving || !formData.endpoint || formData.scopes.length === 0}
              >
                {isSaving && <span className="inline-flex items-center gap-2"><Spinner size={16} /></span>}
                {editingWebhook ? 'Update' : 'Create'} Webhook
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebhookPage;
