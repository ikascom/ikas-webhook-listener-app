// Database interface - maybe mongo, postgresql or dynamo db.
export interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}

// Dummy database implementation
export class DummyDatabase implements Database {
  private connected = false;

  async connect(): Promise<void> {
    console.log('Dummy database connected');
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    console.log('Dummy database disconnected');
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Database instance
export const DB = new DummyDatabase();

// Database connection helper
export const ensureDBConnect = async () => {
  if (!DB.isConnected()) {
    await DB.connect();
  }
};
