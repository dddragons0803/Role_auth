import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'team_member'; // Roles for authentication
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          'Please fill a valid email address',
        ],
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
      },
      role: { 
        type: String, 
        enum: ['admin', 'team_member'], 
        default: 'team_member', 
        required: [true, 'Role is required'],
        },
});

// Pre-save middleware to hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
      // Hash the password using the generated salt
      const hash = await bcrypt.hash(this.password, salt);
      // Replace the plain text password with the hashed password
      this.password = hash;
      next();
    } catch (error) {
      next(error as Error);
    }
  });

  // Method to compare password
  UserSchema.methods.comparePassword = async function (
    candidatePassword: string
  ): Promise<boolean> {
    try {
      // Use bcrypt.compare to compare the candidate password with the hashed password
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      // Handle errors appropriately, e.g., by logging them or rethrowing
      throw new Error('Error comparing passwords');
    }
  };
  

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
