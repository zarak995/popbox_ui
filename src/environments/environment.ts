// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  host: 'http://localhost:3000/',
  chatsRoute: 'chats/',
  userChatsRoute: '/chats/users/',
  topChatsRoute: 'top/chats',
  usersRoute: 'users/',
  avatarRoute: 'avatars/',
  postRoute: 'posts/',
  loginRoute: 'login/',
  registerRoute: 'reg/',
  userVerification: 'ver/',
  userChangePasswordRoute: 'users/change_pass/',
  resendToEmail: 'login/reg/resendEmail',
  resendToSMS: 'login/reg/resendSMS'
};