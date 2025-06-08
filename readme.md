# AWS Learning Series - Complete Guide

## 📚 Table of Contents

### 1. [IAM (Identity and Access Management)](#1-iam-identity-and-access-management)
   - [1.1 What is IAM?](#11-what-is-iam)
   - [1.2 Why IAM Matters in Teams](#12-why-iam-matters-in-teams)
   - [1.3 IAM for Solo Developers](#13-iam-for-solo-developers)
   - [1.4 IAM for Programmatic Access](#14-iam-for-programmatic-access)
   - [1.5 Users and Groups](#15-users-and-groups)
   - [1.6 IAM Best Practices Summary](#16-iam-best-practices-summary)

### 2. [S3 (Simple Storage Service)](#2-s3-simple-storage-service)
   - [2.1 What is S3?](#21-what-is-s3)
   - [2.2 Understanding Buckets](#22-understanding-buckets)
   - [2.3 Public vs Private Access](#23-public-vs-private-access)
   - [2.4 S3 Summary](#24-s3-summary)

### 3. [S3 Bucket Policies](#3-s3-bucket-policies)
   - [3.1 What is a Bucket Policy?](#31-what-is-a-bucket-policy)
   - [3.2 Policy Structure Breakdown](#32-policy-structure-breakdown)
   - [3.3 Policy Fields Explained](#33-policy-fields-explained)
   - [3.4 Common Actions and Troubleshooting](#34-common-actions-and-troubleshooting)
   - [3.5 Making Buckets Public](#35-making-buckets-public)

### 4. [Pre-Signed URLs](#4-pre-signed-urls)
   - [4.1 What are Pre-Signed URLs?](#41-what-are-pre-signed-urls)
   - [4.2 How Pre-Signed URLs Work](#42-how-pre-signed-urls-work)
   - [4.3 Secure File Uploads](#43-secure-file-uploads)
   - [4.4 Testing Pre-Signed URLs](#44-testing-pre-signed-urls)
   - [4.5 Benefits and Best Practices](#45-benefits-and-best-practices)

---

## 1. IAM (Identity and Access Management)

### 1.1 What is IAM?

IAM is AWS's service for **managing access** to AWS resources. It handles two critical security functions:

- **Authentication** – *Who are you?*
- **Authorization** – *What are you allowed to do?*

**Example Scenario:** A user has access to EC2 instances but cannot access S3 buckets or billing information.

---

### 1.2 Why IAM Matters in Teams

In larger development teams, providing everyone with root/admin access creates significant risks:

**Security Risks:**
- Team members could spin up unused services (increasing costs)
- Unauthorized access to sensitive data
- Accidental or intentional system damage

**Best Practice:** Implement the **Principle of Least Privilege**
- Developers working with S3 → S3 access only
- Finance team → Billing access only  
- DevOps team → EC2, IAM, and infrastructure services

---

### 1.3 IAM for Solo Developers

Even independent developers and solo builders should use IAM:

**Key Recommendations:**
- **Avoid using root account** for daily operations
- Create separate **IAM users** with limited permissions
- When using **AWS CLI**, limited access prevents accidentally launching expensive services

**Analogy:** Think of IAM like using `sudo` in Linux—only use elevated privileges when absolutely necessary.

---

### 1.4 IAM for Programmatic Access

When applications need AWS resource access, follow secure practices:

**❌ Insecure Approach:**
- Using root credentials gives the application full AWS access

**✅ Secure Approach:**
1. Create a dedicated IAM user for the application
2. Assign only necessary permissions (e.g., `S3:GetObject`, `S3:PutObject`)
3. Attach a custom permission policy tailored to the app's specific needs

---

### 1.5 Users and Groups

**IAM User:** A unique identity with AWS credentials (username/password and access keys)

**IAM Group:** A collection of users sharing the same permissions

**Practical Example:**
```
Scenario: 10 developers need EC2 access
Solution:
1. Create group "EC2-Dev" with appropriate EC2 permissions
2. Add all developers to this group
3. Remove users when they leave the team (quick and secure)
```

---

### 1.6 IAM Best Practices Summary

- ✅ IAM controls access to AWS resources
- ✅ Don't use root user for daily tasks
- ✅ Assign permissions based on **least privilege principle**
- ✅ Use groups for managing multiple user permissions
- ✅ Use separate IAM users for applications and programmatic access

---

## 2. S3 (Simple Storage Service)

### 2.1 What is S3?

S3 (Simple Storage Service) is AWS's **object storage solution** that allows you to:
- **Upload** files to the cloud
- **Store** virtually unlimited data
- **Retrieve** files from anywhere

---

### 2.2 Understanding Buckets

**What are Buckets?**
- S3 organizes data into **buckets** (like folders or remote hard drives)
- Each bucket can hold **virtually unlimited** data
- Buckets serve as the top-level containers for your objects

**Pricing Structure:**
- **Free Tier:** 5GB of storage
- **Costs based on:**
  - Total storage used
  - Number and type of requests
  - Data transfer (especially outbound/downloads)

**Important Pricing Notes:**
- ✅ Uploading files is usually free
- ⚠️ Downloading (outbound transfer) incurs charges

---

### 2.3 Public vs Private Access

**Default Security:** All S3 buckets and contents are **private by default**

**Making Content Public:**
To allow public access (e.g., serving website images):
1. Define a **bucket policy** or **object-level ACLs**
2. Specify access permissions clearly

**Use Case Examples:**
- **Public:** Static website hosting, public image serving
- **Private:** Backups, sensitive data, internal application files

---

### 2.4 S3 Summary

- ✅ **S3 = Object storage** for any file type (images, videos, JSON, etc.)
- ✅ Create **buckets** to organize your storage
- ✅ Files inside buckets are called **objects**
- ✅ **Free tier provides 5GB** storage
- ✅ **Private by default** with granular access control

---

## 3. S3 Bucket Policies

### 3.1 What is a Bucket Policy?

A **bucket policy** is a JSON document that defines access rules:

> **Core Function:** "Who can do *what* on *which* resources"

Think of bucket policies as security rules controlling access to your bucket and its contents.

---

### 3.2 Policy Structure Breakdown

**Example Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [ "s3:GetObject" ],
      "Resource": [ "arn:aws:s3:::aws-s3-public-bucket-swaroop/*" ]
    }
  ]
}
```

---

### 3.3 Policy Fields Explained

| Field | Purpose | Example Value |
|-------|---------|---------------|
| **Version** | AWS policy language version | `"2012-10-17"` (standard) |
| **Statement** | List of permission rules | Array of rule objects |
| **Sid** | Statement identifier (optional) | `"PublicReadGetObject"` |
| **Principal** | Who gets access | `"*"` (everyone) or specific users |
| **Effect** | Permission type | `"Allow"` or `"Deny"` |
| **Action** | Allowed operations | `"s3:GetObject"` (download/read) |
| **Resource** | Target bucket/objects | `"arn:aws:s3:::bucket-name/*"` |

---

### 3.4 Common Actions and Troubleshooting

**Valid S3 Actions:**
- `s3:GetObject` – Read/download files
- `s3:PutObject` – Upload files  
- `s3:DeleteObject` – Delete files

**⚠️ Common Mistake:** Using invalid actions like `"s3:GetAccessGrant"` will cause policy failures.

---

### 3.5 Making Buckets Public

**Quick Public Access Setup:**
1. Set `"Principal": "*"` to allow everyone
2. Use `"s3:GetObject"` for read access
3. Target objects with `"arn:aws:s3:::your-bucket-name/*"`

**Result:** Public bucket suitable for static site hosting or file sharing.

---

## 4. Pre-Signed URLs

### 4.1 What are Pre-Signed URLs?

**Core Concept:** Pre-signed URLs provide **temporary, secure access** to private S3 objects without making your bucket public.

**Key Benefits:**
- Maintains S3 privacy by default
- Prevents unauthorized uploads or storage abuse
- Provides time-limited access to specific resources

---

### 4.2 How Pre-Signed URLs Work

**For Downloads (GET):**
1. Create an IAM user (e.g., `nodejsS3User`)
2. Grant limited `s3:GetObject` permission
3. Use access keys in your application
4. Generate a **signed URL** pointing to a private object
5. Share the URL—recipients can access the object for a limited time

**Analogy:** "Here's the door key 🔑—but it expires in 60 seconds."

---

### 4.3 Secure File Uploads

**Upload Security Features:**
1. Send metadata (filename, content-type) **before** generating the URL
2. URL is signed for that **specific file with exact metadata**
3. Mismatched uploads are automatically rejected by S3

**Security Example:**
- Generate pre-signed URL for `helloWorld.txt`
- Attempt to upload `virus.exe` → ❌ **Blocked**
- Upload `helloWorld.txt` with wrong content-type → ❌ **Blocked**

---

### 4.4 Testing Pre-Signed URLs

**Testing Upload URLs:**
1. Use Postman or similar API client
2. Set method to **PUT**
3. Use your pre-signed URL
4. In **Body**, select `binary` and upload your file
5. Set correct `Content-Type` header (e.g., `text/plain`, `image/png`)

**Reference:** Check `put.js` for code examples of generating upload links with file metadata.

---

### 4.5 Benefits and Best Practices

**Why Pre-Signed URLs are Powerful:**
- ✨ **Secure by design** - temporary access only
- 🔒 **Precise control** - specific files and operations
- 🚫 **No public exposure** - maintain bucket privacy
- ⏰ **Time-limited** - automatic expiration

**Final Thought:** Pre-signed URLs represent AWS's thoughtful approach to secure, temporary resource access without compromising overall security posture.

---

## 🎯 Quick Reference Guide

| Topic | Key Takeaway | Best Practice |
|-------|--------------|---------------|
| **IAM** | Control who accesses what | Use least privilege principle |
| **S3** | Object storage with buckets | Keep private by default |
| **Bucket Policies** | JSON rules for access control | Use valid actions only |
| **Pre-Signed URLs** | Temporary secure access | Perfect for controlled sharing |

---

*This guide provides a comprehensive foundation for understanding AWS IAM and S3 services. Each section builds upon previous concepts to create a complete learning experience.*