import mongoose from 'mongoose';
import { Base } from '@/lib/interface';
import { Organization as OrganizationType } from 'better-auth/plugins';

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
