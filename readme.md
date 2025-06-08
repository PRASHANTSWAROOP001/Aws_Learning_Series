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


## 🪣 S3 (Simple Storage Service)

S3 stands for **Simple Storage Service** — it’s AWS’s object storage solution.

You can **upload**, **store**, and **retrieve** files (called *objects*) in S3.

---

### 📦 Buckets: Your Remote Hard Drives

* S3 organizes data into **buckets** — like folders or remote hard drives.
* Each bucket can hold **virtually unlimited** data.
* AWS offers **5GB of free** storage under the Free Tier.
* After that, you pay based on:

  * Total storage used
  * Number and type of requests
  * Data transfer (especially **outbound/downloads**)

> ✅ Uploading files is usually free
> ⚠️ Downloading (outbound) or transferring to the internet **incurs charges**

---

### 🔐 Public vs Private Buckets

* By **default**, all S3 buckets and their contents are **private**.
* If you want public access (e.g., to serve images on a website), you need to:

  * Define a **bucket policy** or **object-level ACLs**
  * Clearly specify who can access what (and at what permission level)

Example use cases:

* Public: Hosting static images or a frontend website
* Private: Backups, sensitive data, internal application files

---

### 📝 Summary

* **S3 = object storage** to store any kind of file (images, videos, JSON, etc.)
* Create a **bucket** to begin using S3.
* Files inside a bucket are called **objects**.
* **Free tier = 5GB**. Uploads are free, downloads cost.
* **Buckets are private by default** — you control access via policies and settings.

---


## 🛡️ What is a Bucket Policy?

A **bucket policy** is just a JSON document attached to an S3 bucket that defines:

> 💬 “Who can do *what* on *which* resources.”

Think of it as rules that control access to your bucket and the stuff inside it.

---

### 🔍 Let’s Break It Down

Here’s a quick example:

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

### 📘 What Each Field Means:

* **Version**: Always `"2012-10-17"` — AWS standard, tells AWS how to interpret the policy.
* **Statement**: A list of permission rules. You can have more than one.
* **Sid**: Optional. Just an ID for the statement. Good for tracking if you have many.
* **Principal**: Who gets access. `"*"` means everyone (public access).
* **Effect**: `"Allow"` or `"Deny"`. Here, we’re allowing access.
* **Action**: What they’re allowed to do.
  Example: `"s3:GetObject"` = download/read files.
* **Resource**: Which bucket or objects this applies to.
  `"arn:aws:s3:::bucket-name/*"` = everything inside the bucket.

---

### ⚠️ Note:

Your earlier policy used `"s3:GetAccessGrant"` — that’s not a real S3 action, so it wouldn’t work. Use valid actions like:

* `s3:GetObject` – read files
* `s3:PutObject` – upload files
* `s3:DeleteObject` – delete files

---

### ✅ TL;DR – Make a Bucket Public

If you want to make a bucket public so users can view/download files:

* Use `"Principal": "*"` to allow everyone
* Use `"s3:GetObject"` for read access
* Target your objects with `"arn:aws:s3:::your-bucket-name/*"`

That’s it! You now have a public bucket for things like static site hosting or sharing files.

---

## 🔐 Pre-Signed URLs – Secure, Temporary Access to S3

Everything in S3 is private by default (and that’s a good thing).

Let’s say you want to **let users view or upload files** – but you *don’t* want to make your bucket public or risk abuse (like people uploading junk or eating your storage bill alive 💸).

That’s where **Pre-Signed URLs** come in.

---

### 🧠 What is a Pre-Signed URL?

A **pre-signed URL** is a temporary, secure link to a specific object in S3. It’s generated by a trusted IAM user (like a backend app) and allows:

* ✅ Reading/downloading (GET)
* ✅ Uploading (PUT)
* ❌ No other wild actions unless explicitly allowed

---

### ✍️ How it works (for downloads):

1. Create an IAM user (e.g., `nodejsS3User`)
2. Give it limited `s3:GetObject` permission
3. Use its access key & secret key in your app (Node.js, etc.)
4. Generate a **signed URL** that points to a private object
5. Share the URL with someone — they can access the object *only for a limited time*

> Think of it like: "Hey, here’s the door key 🔑 — but it expires in 60 seconds."

---

### 📤 Uploading Files? It’s More Secure

To upload using a pre-signed URL:

1. You must send metadata (like file name, content-type) **before** generating the URL
2. The URL is signed *for that specific file with that metadata*
3. If the uploaded file doesn’t match — S3 rejects it. Boom 💥

Example:

* You generate a pre-signed URL for `helloWorld.txt`
* Someone tries to upload `virus.exe` → ❌ blocked
* Someone uploads `helloWorld.txt` but with wrong content-type → ❌ blocked again

---

### 🧪 Pro Tip

To test uploading:

* Use Postman or any API client
* Set method to **PUT**
* Paste your pre-signed URL
* In **Body**, choose `binary`, upload your file
* Set correct `Content-Type` header (e.g., `text/plain`, `image/png`)

Check out the code in `put.js` to generate an upload link based on file metadata.

---

### ❤️ Final Thoughts

Pre-signed URLs = ✨secure magic✨ by AWS.

They let your app give temporary, precise access to files **without exposing your S3 to the public**.

Massive respect to AWS for thinking this through.

---
