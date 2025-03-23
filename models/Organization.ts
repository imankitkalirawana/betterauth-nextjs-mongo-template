import mongoose from 'mongoose';
import { Base } from '@/lib/interface';

export interface OrganizationType extends Base {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  metadata: string;
}

const organizationSchema = new mongoose.Schema<OrganizationType>(
  {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    logo: String,
    metadata: String
  },
  { timestamps: true }
);

const Organization =
  mongoose.models.Organization ||
  mongoose.model('Organization', organizationSchema, 'organization');

export default Organization;
