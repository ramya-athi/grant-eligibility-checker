# grant-eligibility-checker
Green home grant scheme eligibility checker

# Collabrators
## Nithin
## Ramya

# Details
# First Time GitHub SSH Setup

# 1. Configure Git Identity
git config --global user.name "Nithin Sadanandan"
git config --global user.email "@gmail.com"

# Verify
git config --global --list

# 2. Generate SSH Key
ssh-keygen -t ed25519 -C "@gmail.com"

# Press Enter for all prompts

# 3. Start SSH Agent
eval "$(ssh-agent -s)"

# 4. Add SSH Key
ssh-add ~/.ssh/id_ed25519

# 5. Display Public Key
cat ~/.ssh/id_ed25519.pub

# 6. Copy the entire output and add it to:
# GitHub > Settings > SSH and GPG Keys > New SSH Key

# 7. Test SSH Connection
ssh -T git@github.com

# Expected Output
# Hi <username>! You've successfully authenticated.

# 8. Check Remote
git remote -v

# 9. Change HTTPS to SSH
git remote set-url origin git@github.com:ramya-athi/grant-eligibility-checker.git

# 10. Verify
git remote -v

# Expected
# origin git@github.com:ramya-athi/grant-eligibility-checker.git (fetch)
# origin git@github.com:ramya-athi/grant-eligibility-checker.git (push)

# Running the app

```bash
cd starter
npm ci            # install dependencies (node_modules is not committed)
npm run dev       # copies GOV.UK Frontend assets, then serves https://<hostname>:5002
npm test          # unit, journey and accessibility tests (Vitest)
npm run build     # production build in starter/dist
```

- Planning docs: `intent.md` (why and scope), `spec.md` (requirements), `plan.md` (build plan and record).
- AI usage log: `starter/AI_LOG.md`. Claude Code rules: `starter/CLAUDE.md`.
- Styling is GOV.UK Frontend 6.5.1. Its GDS Transport font is licensed only for services on gov.uk domains, which is fine for this prototype.
