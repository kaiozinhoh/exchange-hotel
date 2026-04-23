## Deploy em Produção (EasyPanel + FrankenPHP)

Este projeto já está pronto para deploy com `FrankenPHP` via Docker no EasyPanel.

### Configuração no EasyPanel

- **Build Context:** raiz do repositório
- **Dockerfile:** `Dockerfile`
- **Porta do serviço:** `8000`
- **Domínio:** configure normalmente no EasyPanel (ele faz proxy para porta interna)

### Variáveis obrigatórias

Defina no painel:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://seu-dominio.com`
- `DB_CONNECTION=mysql`
- `DB_HOST=...`
- `DB_PORT=3306`
- `DB_DATABASE=...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`

Opcional:

- `RUN_MIGRATIONS=true` (padrão `true`)

### O que o container faz ao iniciar

O `docker/entrypoint.sh` executa automaticamente:

1. cria `.env` se não existir
2. tenta gerar `APP_KEY`
3. roda migrations (`php artisan migrate --force`)
4. cria symlink de storage
5. aplica caches de produção
6. sobe o app com FrankenPHP na porta `8000`

### Logs

Para acompanhar erros da aplicação Laravel:

```bash
tail -f storage/logs/laravel.log
```





<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## 🙏 Agradecimentos

- [Laravel](https://laravel.com/) - Framework PHP incrível
- [React](https://reactjs.org/) - Biblioteca JavaScript poderosa
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS fantástico
- [Inertia.js](https://inertiajs.com/) - SPA sem complexidade

---

<div align="center">

**Desenvolvido com ❤️ por [Kaio Oliveira](https://github.com/kaiozinhoh)**

[⭐ Star este projeto](https://github.com/kaiozinhoh/exchange-hotel) • [🐛 Reportar Issue](https://github.com/kaiozinhoh/exchange-hotel/issues) • [📧 Contato](mailto:kaio@exhangehotel.com)

</div>
- **[Tighten Co.](https://tighten.co)**
- **[WebReinvent](https://webreinvent.com/)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Jump24](https://jump24.co.uk)**
- **[Redberry](https://redberry.international/laravel/)**
- **[Active Logic](https://activelogic.com)**
- **[byte5](https://byte5.de)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
