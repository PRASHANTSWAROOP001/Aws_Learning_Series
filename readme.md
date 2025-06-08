# AWS Learning Series

## 🛡️ IAM (Identity and Access Management)

IAM is the service used to **manage access** to AWS resources. It handles both:

* **Authentication** – Who are you?
* **Authorization** – What are you allowed to do?

Example: A user is only allowed to access an EC2 instance but not S3 or billing.

---

### 🔧 Why IAM Matters (Especially in Teams)

In larger teams, giving everyone root/admin access is risky — anyone could:

* Spin up unused services (increasing costs)
* Access sensitive data
* Accidentally (or intentionally) break things

**Best practice:** Give people only the access they need.

* Developers working with S3 → S3 access only
* Finance team → Billing access only
* DevOps team → EC2, IAM, etc.

---

### 👤 How Can Solo Developers Use IAM?

Even as an indie dev or solo builder:

* **Avoid using the root account** for daily operations.
* Create separate **IAM users** with limited permissions.
* If using **AWS CLI**, having limited access reduces chances of accidentally launching services like EC2.

Think of it like using `sudo` in Linux only when absolutely needed.

---

### 🔐 IAM for Programmatic Access

Let’s say your app needs to access an S3 bucket.

* **❌ Bad:** Use root credentials — the app now has full access to your AWS.
* **✅ Good:**

  * Create a dedicated IAM user for the app.
  * Assign only `S3:GetObject`, `S3:PutObject`, etc.
  * Attach a permission policy tailored to the app's needs.

---

### 👥 IAM Users & Groups

* **IAM User**: A unique identity with AWS credentials (username/password, access keys).
* **IAM Group**: A collection of users that share the same permissions.

Example:
10 developers need access to EC2.
→ Create a group `EC2-Dev` with proper EC2 permissions.
→ Add all devs to this group.
→ Remove users when they leave — quick and secure.

---

### ✅ Summary

* IAM = Access control for AWS resources.
* Don’t use root user for day-to-day tasks.
* Assign permissions based on **least privilege**.
* Use groups to manage permissions for multiple users.
* Use separate IAM users for apps and programmatic access.

---

