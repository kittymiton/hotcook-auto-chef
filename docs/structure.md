# 🔖 ディレクトリ構成メモ（2025/09/06）

## 🗂 app/

- (auth)\_components/ → 認証専用のUI部品
- (auth)\_hooks/ → 認証専用のカスタムフック
- (auth)\_paths/ → 認証パス定数（LOGIN_PATHなど）

## 🗂 constants/

- paths.ts → globalパス定数
- meta.ts, config.ts など用途ごと

## 🎯 設計意図

-

## 📝 TODO

- tsconfigのalias設定確認

app/
├── (auth)/ ← 認証まわり専用
│ ├── login/など ← 認証まわりルーティングページ
│ │ └── page.tsx
│ ├── \_components/ ← 認証UI部品
│ │ └── AuthErrorBanner.tsx
│ ├── \_hooks/ ← 認証用hook
│ │ └── useAuthForm.ts
│ └── \_constants/ ← 認証系定数（パス）
│ │ └── paths.ts
│ ├── lib ← 認証まわりライブラリ
│ │ └── getAuthErrorInfo.ts,sign.ts,hasAuthErrorInfoUrl.ts
│ │ └── validation
│ │ └── authSchema.ts,resendSchema.ts

├── (authenticated)/ ← ログイン済ユーザー向け
│ └── \_components/
│ ├── \_hooks/
│ ├── talkRoom/
│
├── Header/
├── api/
├── lib/
├── api/

src/
├── constants/
│ └── api.ts ← APIパスを定数化
├── lib/
│ ├── fetcher.ts ← fetch共通
│ └── supabase.ts ← supabase client
├── app/
│ └── auth/
│ ├── lib/ ← 認証専用関数（例: getAuthErrorInfo）

## 🔧 Lintスクリプトについて

### "lint"

Next.js公式のLintチェック。`next lint` を実行する。

### "lint:raw"

TypeScriptの型チェック強化用。

- 明示的な戻り値型がない関数に警告を出す
- `any` 型の使用にも警告

```json
"rules": {
  "@typescript-eslint/explicit-function-return-type": "warn",
  "@typescript-eslint/no-explicit-any": "warn"
}

```
