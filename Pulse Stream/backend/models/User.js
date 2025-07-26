import { createClient } from '@supabase/supabase-js'

const bcrypt = require('bcryptjs');
// Create a single supabase client for interacting with your database
const supabase = createClient('https://fjsqyhnuvnxhhddrzkwu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqc3F5aG51dm54aGhkZHJ6a3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTk0MzcsImV4cCI6MjA2ODE3NTQzN30.HJROEwjr1zS023RbRJmWMPAnZ5dkv5_hW5vagBhzXnI')

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.username = data.username;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.role = data.role || 'user';
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.last_login = data.last_login;
  }

  // Pass Hashing
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  }

  // Create new user
  static async create(userData) {
    try {
      const hashedPassword = await this.hashPassword(userData.password);
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: userData.name.trim(),
            username: userData.username.toLowerCase().trim(),
            email: userData.email ? userData.email.toLowerCase().trim() : null,
            password_hash: hashedPassword,
            role: userData.role || 'user'
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return new User(data);
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw error;
      }

      return new User(data);
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw error;
      }

      return new User(data);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw error;
      }

      return new User(data);
    } catch (error) {
      throw error;
    }
  }

  // Update last login
  async updateLastLogin() {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', this.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      this.last_login = data.last_login;
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async update(updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update instance properties
      Object.assign(this, data);
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Soft delete user
  async deactivate() {
    return await this.update({ is_active: false });
  }

  // Get user profile
  async getProfile() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', this.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Create or update user profile
  async updateProfile(profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert([
          {
            user_id: this.id,
            ...profileData
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get user's health metrics
  async getHealthMetrics(metricType = null, limit = 100, startDate = null, endDate = null) {
    try {
      let query = supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', this.id)
        .order('recorded_at', { ascending: false })
        .limit(limit);

      if (metricType) {
        query = query.eq('metric_type', metricType);
      }

      if (startDate) {
        query = query.gte('recorded_at', startDate);
      }

      if (endDate) {
        query = query.lte('recorded_at', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Add health metric
  async addHealthMetric(metricData) {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .insert([
          {
            user_id: this.id,
            ...metricData
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Remove password from JSON output
  toJSON() {
    const userObject = { ...this };
    delete userObject.password_hash;
    return userObject;
  }

  // Get safe user data for API responses
  getSafeUserData() {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      email: this.email,
      role: this.role,
      last_login: this.last_login,
      created_at: this.created_at
    };
  }
}

module.exports = User;
